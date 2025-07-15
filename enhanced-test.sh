#!/bin/bash
# enhanced-test.sh - Test the enhanced SDF extension
# $ chmod +x enhanced-test.sh
# $ ./enhanced-test.sh

echo "🚀 Testing Enhanced SDF Language Support Extension"
echo "================================================="

# Compile and package
npm run compile && npm run package

# Create comprehensive test file
mkdir -p test-files
cat > test-files/advanced-robot.sdf << 'EOF'
<?xml version="1.0" ?>
<sdf version="1.9">
  <world name="robot_world">
    <physics name="default_physics" default="0" type="ode">
      <gravity>0 0 -9.8066</gravity>
      <ode>
        <solver>
          <type>quick</type>
          <iters>150</iters>
        </solver>
      </ode>
    </physics>
    
    <model name="mobile_robot">
      <pose>0 0 0.1 0 0 0</pose>
      
      <link name="base_link">
        <inertial>
          <mass>5.0</mass>
          <inertia>
            <ixx>0.1</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>0.1</iyy>
            <iyz>0.0</iyz>
            <izz>0.1</izz>
          </inertia>
        </inertial>
        
        <visual name="base_visual">
          <geometry>
            <box>
              <size>0.6 0.4 0.2</size>
            </box>
          </geometry>
          <material>
            <ambient>0.2 0.2 0.8 1</ambient>
            <diffuse>0.2 0.2 0.8 1</diffuse>
          </material>
        </visual>
        
        <collision name="base_collision">
          <geometry>
            <box>
              <size>0.6 0.4 0.2</size>
            </box>
          </geometry>
        </collision>
        
        <sensor name="lidar" type="ray">
          <pose>0 0 0.1 0 0 0</pose>
          <ray>
            <scan>
              <horizontal>
                <samples>640</samples>
                <resolution>1</resolution>
                <min_angle>-1.57</min_angle>
                <max_angle>1.57</max_angle>
              </horizontal>
            </scan>
            <range>
              <min>0.1</min>
              <max>10.0</max>
              <resolution>0.01</resolution>
            </range>
          </ray>
        </sensor>
      </link>
      
      <link name="left_wheel">
        <pose>0 0.25 0 1.57 0 0</pose>
        <inertial>
          <mass>1.0</mass>
          <inertia>
            <ixx>0.01</ixx>
            <ixy>0.0</ixy>
            <ixz>0.0</ixz>
            <iyy>0.01</iyy>
            <iyz>0.0</iyz>
            <izz>0.01</izz>
          </inertia>
        </inertial>
        
        <visual name="wheel_visual">
          <geometry>
            <cylinder>
              <radius>0.1</radius>
              <length>0.05</length>
            </cylinder>
          </geometry>
        </visual>
        
        <collision name="wheel_collision">
          <geometry>
            <cylinder>
              <radius>0.1</radius>
              <length>0.05</length>
            </cylinder>
          </geometry>
        </collision>
      </link>
      
      <joint name="left_wheel_joint" type="continuous">
        <parent>base_link</parent>
        <child>left_wheel</child>
        <axis>
          <xyz>0 1 0</xyz>
        </axis>
      </joint>
    </model>
  </world>
</sdf>
EOF

# Create error test file
cat > test-files/error-test.sdf << 'EOF'
<?xml version="1.0" ?>
<sdf version="2.0">
  <world>
    <model>
      <link>
        <visual>
          <geometry>
            <box>
              <size>1 1 1</size>
          </geometry>
        </visual>
      </link>
      <joint type="invalid_type">
        <parent>link1</parent>
        <child>link2</child>
      </joint>
    </model>
  </world>
</sdf>
EOF

echo "✅ Test files created"

# Install extension
VSIX_FILE=$(ls *.vsix 2>/dev/null | head -1)
if [ -n "$VSIX_FILE" ]; then
    code --install-extension "$VSIX_FILE" --force
    echo "✅ Extension installed: $VSIX_FILE"
    
    echo ""
    echo "🧪 Testing Instructions:"
    echo "1. Open: code test-files/advanced-robot.sdf"
    echo "2. Check syntax highlighting (different colors for world/model/link/sensor)"
    echo "3. Try auto-completion: type '<' inside elements"
    echo "4. Hover over elements for documentation"
    echo "5. Open error-test.sdf to see error detection"
    echo "6. Check Problems panel (Ctrl+Shift+M) for validation errors"
    echo ""
    echo "🎯 Key Features to Test:"
    echo "   ✓ Syntax highlighting with robotics-specific colors"
    echo "   ✓ Smart auto-completion based on context"
    echo "   ✓ Real-time error detection and validation"
    echo "   ✓ Hover documentation for SDF elements"
    echo "   ✓ Missing tag detection"
    echo "   ✓ Invalid joint type validation"
    echo "   ✓ Required attribute checking"
else
    echo "❌ No .vsix file found"
fi