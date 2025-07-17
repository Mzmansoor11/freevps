import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions
} from 'react-native';
import { UserContext } from '../context/UserContext';
import { OrderContext } from '../context/OrderContext';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

const AdminDashboardScreen = ({ navigation }) => {
  const { user, logout } = useContext(UserContext);
  const { orders } = useContext(OrderContext);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    activeVendors: 12,
    totalCustomers: 150
  });

  useEffect(() => {
    // Calculate stats from orders
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending' || order.status === 'preparing').length;
    const completedOrders = orders.filter(order => order.status === 'delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    setStats({
      ...stats,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue
    });
  }, [orders]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            navigation.navigate('Home');
          }
        }
      ]
    );
  };

  const StatCard = ({ title, value, color = theme.colors.primary, subtitle }) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const ActionButton = ({ title, onPress, color = theme.colors.primary, icon }) => (
    <TouchableOpacity style={[styles.actionButton, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.actionButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.adminName}>{user?.name || 'Admin'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Dashboard Overview</Text>
          <View style={styles.statsGrid}>
            <StatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              color={theme.colors.primary}
              subtitle="All time"
            />
            <StatCard 
              title="Pending Orders" 
              value={stats.pendingOrders} 
              color="#FF9500"
              subtitle="Need attention"
            />
            <StatCard 
              title="Completed Orders" 
              value={stats.completedOrders} 
              color="#34C759"
              subtitle="This month"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${stats.totalRevenue.toFixed(2)}`} 
              color="#007AFF"
              subtitle="This month"
            />
            <StatCard 
              title="Active Vendors" 
              value={stats.activeVendors} 
              color="#5856D6"
              subtitle="Currently online"
            />
            <StatCard 
              title="Total Customers" 
              value={stats.totalCustomers} 
              color="#FF2D92"
              subtitle="Registered users"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionButton 
              title="Manage Orders" 
              onPress={() => Alert.alert('Feature', 'Order management coming soon!')}
              color={theme.colors.primary}
            />
            <ActionButton 
              title="Vendor Management" 
              onPress={() => Alert.alert('Feature', 'Vendor management coming soon!')}
              color="#FF9500"
            />
            <ActionButton 
              title="Customer Support" 
              onPress={() => Alert.alert('Feature', 'Customer support panel coming soon!')}
              color="#34C759"
            />
            <ActionButton 
              title="Analytics" 
              onPress={() => Alert.alert('Feature', 'Analytics dashboard coming soon!')}
              color="#007AFF"
            />
            <ActionButton 
              title="Settings" 
              onPress={() => Alert.alert('Feature', 'Admin settings coming soon!')}
              color="#5856D6"
            />
            <ActionButton 
              title="Reports" 
              onPress={() => Alert.alert('Feature', 'Reports generation coming soon!')}
              color="#FF2D92"
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>New order #1001 received</Text>
              <Text style={styles.activityTime}>2 min ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Vendor "Pizza Palace" went online</Text>
              <Text style={styles.activityTime}>15 min ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>Order #998 delivered successfully</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
            <View style={styles.activityItem}>
              <Text style={styles.activityText}>New customer registered</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  welcomeText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  logoutText: {
    color: theme.colors.white,
    fontWeight: '600',
  },
  statsContainer: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: (width - theme.spacing.lg * 3) / 2,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  actionsContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: (width - theme.spacing.lg * 3) / 2,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  activityContainer: {
    padding: theme.spacing.lg,
    paddingTop: 0,
  },
  activityList: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: theme.colors.text,
  },
  activityTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default AdminDashboardScreen;